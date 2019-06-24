using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng_Core.Email
{
    public class sendEmailDetails
    {
        public string FromName { get; set; }

        public string FromEmail { get; set; }

        public string ToMail { get; set; }

        public string  ToName { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public bool IsHtml { get; set; }
    }
}
