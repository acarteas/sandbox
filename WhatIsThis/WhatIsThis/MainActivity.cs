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
            var client = Google.Cloud.Vision.V1.ImageAnnotatorClient.Create();
            var response = client.DetectLabels(Google.Cloud.Vision.V1.Image.FromFile(_file.Path));
            

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

