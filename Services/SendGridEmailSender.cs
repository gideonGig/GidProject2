using Microsoft.Extensions.Options;
using ng_Core.Email;
using ng_Core.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng_Core.Services
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly AppSettings _appSettings;


        public SendGridEmailSender(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public async Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            var apiKey = _appSettings.SendGridKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("okhakumhegideon@yahoo.com", "agididi");
            var subject = emailSubject;
            var to = new EmailAddress(userEmail, "TEST");
            var plainTextContent = message;
            var htmlContent = message;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            return new SendEmailResponse();
        }
    }
}
