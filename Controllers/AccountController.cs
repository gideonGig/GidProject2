﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ng_Core.Email;
using ng_Core.Helpers;
using ng_Core.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ng_Core.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signManager;

        private readonly AppSettings _appSettings;

        private IEmailSender _emailSender;
       
        //initialise the private variables in the constructor.
        //recommends that Appsetings should be initalilsed using an interface
        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,
                                        IOptions<AppSettings> appSettings, IEmailSender emailSender )
        {
            _userManager = userManager;
            _signManager = signInManager ;
            _appSettings = appSettings.Value;
            _emailSender = emailSender;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody]RegisterViewModel formdata)
        {
            //create a List that would hold all the errors during registration
            List<string> ErrorList = new List<string>();

            //create user object that will specify Person name, password email which would come from the formdata
            var user = new IdentityUser
            {
                Email = formdata.Email,
                UserName = formdata.UserName,
                //password not supplied here, security stamp looks for changes in the form data and it updates
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded)
            {
                // add user to Customer Role
                await _userManager.AddToRoleAsync(user, "Customer");

                // send confirmation Email using sendGrid email server
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var callBackurl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);

                await _emailSender.SendEmailAsync(user.Email, "Giddy.com Confirm Your Email", "please confirm your mail: <a href=\"" + callBackurl + "\">click here</a>");
                
                //sends response to the client without the password
                return Ok(new { username = user.UserName, email = user.Email, status = 1, message = "Registration Successful" });
            }
             
            else
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    ErrorList.Add(error.Description);

                }
            }

            return BadRequest(new JsonResult(ErrorList));

        }

        //login method
        //create method to login users and send them token when ever they need to access other views which need 
       // authentication and authorization

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel formdata)
        {
            //create an object to get user specific entity from database, find user by name asynchronously using dependency Injection
            var user = await _userManager.FindByNameAsync(formdata.UserName);
           

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            //check error or pasword validity or user dont exist asynchronusly.
            if(user != null && await  _userManager.CheckPasswordAsync(user, formdata.Password))
            {
                //confirmation Email
                if(!await _userManager.IsEmailConfirmedAsync(user))
                {
                    ModelState.AddModelError(string.Empty, "User Has not confirmed Email");

                    return BadRequest(new { LoginError = "We sent a confirmation Mail." +
                                                 "Please confirm your registration with giddy.com" });
                }

                    //create role
                var roles = await _userManager.GetRolesAsync(user);

                //generate a token handler to hook to tokenDescriptoy
                var tokenHandler = new JwtSecurityTokenHandler();

                //generate toeknDescriptor
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        //Sub identifier for userName
                        new Claim(JwtRegisteredClaimNames.Sub, formdata.UserName),
                        //Jti prevents token replay,use token identifier only once
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        //create a claim for user role 
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.UtcNow.ToString())
                    }),

                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),

                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
                    Expires = DateTime.Now.AddMinutes(tokenExpiryTime)                
                };

                //create token
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo,
                                username = user.UserName, userRole = roles.FirstOrDefault()});
                

            }

            //if result credentials has issues
            ModelState.AddModelError("", "UserName AND Password was not found");
            return BadRequest(ModelState);

        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            List<string> errorList = new List<string>();

            if (string.IsNullOrWhiteSpace(userId)||string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("", "User ID and Code are required");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new JsonResult("ERROR");
            }
            if (user.EmailConfirmed)
            {
                return Redirect("/login");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);

            if (result.Succeeded)
            {
                return RedirectToAction("EmailConfirmed", "Notification", new { userId, code });
            }

            else
            {
               
                foreach(var err in result.Errors)
                {
                   
                    errorList.Add(err.ToString());
                }
                return new JsonResult(errorList);
            }

          

        }

    }
}
