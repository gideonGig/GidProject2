using Microsoft.Extensions.DependencyInjection;
using ng_Core.Services;


namespace ng_Core.Email
{
    public static class SendGridExtension
    {
        public static IServiceCollection AddSendGridEmailSender(this IServiceCollection services)
        {
            services.AddTransient<IEmailSender, SendGridEmailSender>();

            return services;
        }
    }
}
