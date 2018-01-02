using Google.Apis.Discovery.v1;
using Google.Apis.Discovery.v1.Data;
using Google.Apis.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleDiscoveryApiTest
{
    //tutorial from https://developers.google.com/api-client-library/dotnet/get_started
    class Program
    {
        static void Main(string[] args)
        {

            // Create the service.
            var service = new DiscoveryService(new BaseClientService.Initializer
            {
                ApplicationName = "Discovery Sample",
                ApiKey = "key",
            });

            // Run the request.
            Console.WriteLine("Executing a list request...");
            var result = service.Apis.List().Execute();

            // Display the results.
            if (result.Items != null)
            {
                foreach (DirectoryList.ItemsData api in result.Items)
                {
                    Console.WriteLine(api.Id + " - " + api.Title);
                }
            }

        }
    }
}
