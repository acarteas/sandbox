using Android.App;
using Android.Widget;
using Android.OS;
using Android.Graphics;
using Java.IO;
using System.Collections.Generic;
using Android.Content;
using Android.Content.PM;
using Android.Provider;
using Java.Nio;
using Flurl.Http;
//https://keestalkstech.com/2016/06/get-keywords-for-images-from-the-google-cloud-vision-api-with-c/
namespace WhatIsThis
{
    [Activity(Label = "WhatIsThis", MainLauncher = true, Icon = "@mipmap/icon")]
    public class MainActivity : Activity
    {
        int count = 1;
        public static File _file;
        public static File _dir;
        public static Bitmap _bitmap;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            if(IsThereAnAppToTakePictures() == true)
            {
                CreateDirectoryForPictures();

                // Get our button from the layout resource,
                // and attach an event to it
                Button button = FindViewById<Button>(Resource.Id.myButton);
                button.Click += TakePicture;
            }     
        }

        private void TakePicture(object sender, System.EventArgs e)
        {
            Intent intent = new Intent(MediaStore.ActionImageCapture);
            _file = new File(_dir, string.Format("myPhoto_{0}.jpg", System.Guid.NewGuid()));
            intent.PutExtra(MediaStore.ExtraOutput, Android.Net.Uri.FromFile(_file));
            StartActivityForResult(intent, 0);
        }

        private bool IsThereAnAppToTakePictures()
        {
            Intent intent = new Intent(MediaStore.ActionImageCapture);
            IList<ResolveInfo> availableActivities =
                PackageManager.QueryIntentActivities(intent, PackageInfoFlags.MatchDefaultOnly);
            return availableActivities != null && availableActivities.Count > 0;
        }

        private void CreateDirectoryForPictures()
        {
            _dir = new File(
                Android.OS.Environment.GetExternalStoragePublicDirectory(
                    Android.OS.Environment.DirectoryPictures), "WhatIsThis");
            if (!_dir.Exists())
            {
                _dir.Mkdirs();
            }
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            // Make it available in the gallery

            Intent mediaScanIntent = new Intent(Intent.ActionMediaScannerScanFile);
            var contentUri = Android.Net.Uri.FromFile(_file);
            mediaScanIntent.SetData(contentUri);
            SendBroadcast(mediaScanIntent);

            // Display in ImageView. We will resize the bitmap to fit the display.
            // Loading the full sized image will consume too much memory
            // and cause the application to crash.
            ImageView imageView = FindViewById<ImageView>(Resource.Id.imageView1);
            int height = Resources.DisplayMetrics.HeightPixels;
            int width = imageView.Height;
            _bitmap = _file.Path.LoadAndResizeBitmap(width, height);

            /* how to convert from Android image to C# image
            var byteArray = ByteBuffer.Allocate(_bitmap.ByteCount);
            _bitmap.CopyPixelsToBuffer(byteArray);
            byte[] bytes = byteArray.ToArray<byte>();
            var image = new Xamarin.Forms.Image();        
            image.Source = Xamarin.Forms.ImageSource.FromStream(() => new System.IO.MemoryStream(bytes));
            */
            var foo = new Google.Apis.Services.BaseClientService.Initializer()
            {
                ApplicationName = "Discovery Sample",
                ApiKey = "[YOUR_API_KEY_HERE]",
            };
            //var client = Google.Cloud.Vision.V1.ImageAnnotatorClient.Create();
            //var response = client.DetectLabels(Google.Cloud.Vision.V1.Image.FromFile(_file.Path));

            string bitmapString = "";
            using (var stream = new System.IO.MemoryStream())
            {
                _bitmap.Compress(Bitmap.CompressFormat.Jpeg, 0, stream);

                var bytes = stream.ToArray();
                bitmapString = System.Convert.ToBase64String(bytes);
            }

            //var apiData = new
            //{
            //    key = " e07bcdb4138be3fa87a617d39bbd63f8abb193eb",
            //    image = new { content = bitmapString }
            //};
            //var apiResponse = await "https://vision.googleapis.com/v1/images:annotate"
            //    .PostUrlEncodedAsync(apiData)
            //    .ReceiveString();
            
            string credPath = "google_api.json";
            Google.Apis.Auth.OAuth2.GoogleCredential cred;
            // Get active credential
            using (var stream = Assets.Open(credPath))
            {
                cred = Google.Apis.Auth.OAuth2.GoogleCredential.FromStream(stream);
            }
            cred = cred.CreateScoped(Google.Apis.Vision.v1.VisionService.Scope.CloudPlatform);

            // By default, the Google.Cloud.BigQuery.V2 library client will authenticate 
            // using the service account file (created in the Google Developers 
            // Console) specified by the GOOGLE_APPLICATION_CREDENTIALS 
            // environment variable. If you are running on
            // a Google Compute Engine VM, authentication is completely 
            // automatic.
            var client = new Google.Apis.Vision.v1.VisionService(new Google.Apis.Services.BaseClientService.Initializer()
            {
                ApplicationName = "subtle-isotope-190917",
                HttpClientInitializer = cred
            });
            var request = new Google.Apis.Vision.v1.Data.AnnotateImageRequest();
            request.Image = new Google.Apis.Vision.v1.Data.Image();
            request.Image.Content = bitmapString;
            request.Features = new List<Google.Apis.Vision.v1.Data.Feature>();
            request.Features.Add(new Google.Apis.Vision.v1.Data.Feature() { Type = "LABEL_DETECTION" });
            var batch = new Google.Apis.Vision.v1.Data.BatchAnnotateImagesRequest();
            batch.Requests = new List<Google.Apis.Vision.v1.Data.AnnotateImageRequest>();
            batch.Requests.Add(request);
            var apiResult = client.Images.Annotate(batch).Execute();

            if (_bitmap != null)
            {
                imageView.SetImageBitmap(_bitmap);
                _bitmap = null;
            }

            // Dispose of the Java side bitmap.
            System.GC.Collect();
        }
    }

    public static class BitmapHelpers
    {
        public static Bitmap LoadAndResizeBitmap(this string fileName, int width, int height)
        {
            // First we get the the dimensions of the file on disk
            BitmapFactory.Options options = new BitmapFactory.Options { InJustDecodeBounds = true };
            BitmapFactory.DecodeFile(fileName, options);

            // Next we calculate the ratio that we need to resize the image by
            // in order to fit the requested dimensions.
            int outHeight = options.OutHeight;
            int outWidth = options.OutWidth;
            int inSampleSize = 1;

            if (outHeight > height || outWidth > width)
            {
                inSampleSize = outWidth > outHeight
                                   ? outHeight / height
                                   : outWidth / width;
            }

            // Now we will load the image and have BitmapFactory resize it for us.
            options.InSampleSize = inSampleSize;
            options.InJustDecodeBounds = false;
            Bitmap resizedBitmap = BitmapFactory.DecodeFile(fileName, options);

            return resizedBitmap;
        }
    }
}

