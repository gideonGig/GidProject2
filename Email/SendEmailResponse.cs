using System;

namespace ng_Core.Email
{
    public class SendEmailResponse
    {
        public string ErrorMsg { get; set; }
        public bool Successful => ErrorMsg == null;
    }
}
