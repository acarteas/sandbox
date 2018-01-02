using Google.Apis.Auth.OAuth2;
using Google.Cloud.BigQuery.V2;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleBigDataApiTest
{
    /*
     * From SO link.  Not used, but might be of interest later
     var json = File.ReadAllText(credPath);
            Newtonsoft.Json.Linq.JObject cr = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(json);
            string privateKey = (string)cr.GetValue("private_key");
            string clientEmal = (string)cr.GetValue("client_email");

            // Create an explicit ServiceAccountCredential credential
            var xCred = new ServiceAccountCredential(new ServiceAccountCredential.Initializer(clientEmal)
            {
            }.FromPrivateKey(privateKey));
     * */

    class Program
    {
        //taken from tutorial at https://cloud.google.com/bigquery/create-simple-app-api
        //how to load credential from file adapted from SO: https://stackoverflow.com/questions/38385867/how-to-login-to-google-api-with-service-account-in-c-sharp-invalid-credentials
        static void Main(string[] args)
        {
            string credPath = "Sandbox-e07bcdb4138b.json";
            GoogleCredential cred;
            // Get active credential
            using (var stream = new FileStream(credPath, FileMode.Open, FileAccess.Read))
            {
                cred = GoogleCredential.FromStream(stream);
            }

            // By default, the Google.Cloud.BigQuery.V2 library client will authenticate 
            // using the service account file (created in the Google Developers 
            // Console) specified by the GOOGLE_APPLICATION_CREDENTIALS 
            // environment variable. If you are running on
            // a Google Compute Engine VM, authentication is completely 
            // automatic.
            var client = BigQueryClient.Create("subtle-isotope-190917", cred);
            var table = client.GetTable("bigquery-public-data", "samples", "shakespeare");

            string query = $@"SELECT corpus AS title, COUNT(*) AS unique_words FROM `{table.FullyQualifiedId}` 
                    GROUP BY title ORDER BY unique_words DESC LIMIT 42";
            var result = client.ExecuteQuery(query, parameters: null);
            Console.Write("\nQuery Results:\n------------\n");
            foreach (var row in result)
            {
                Console.WriteLine($"{row["title"]}: {row["unique_words"]}");
            }
            Console.WriteLine("\nPress any key...");
            Console.ReadKey();
        }

    }
}
