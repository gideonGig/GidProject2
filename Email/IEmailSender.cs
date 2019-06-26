using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng_Core.Email
{
    public interface IEmailSender
    {
        // call send email asyn method
        Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message);
    }
}
