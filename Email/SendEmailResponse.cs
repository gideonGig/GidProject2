using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ng_Core.Email
{
    public class SendEmailResponse
    {
        public string ErrorMsg { get; set; }
        public bool Successful => ErrorMsg == null;
    }
}
