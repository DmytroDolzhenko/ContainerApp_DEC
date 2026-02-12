using Application.Common.Interfaces;
using Net.Codecrete.QrCodeGenerator;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Services
{
    public class QrCodeService : IQrCodeService
    {
        private const string BaseUrl = "https://localhost:7217/api/containers/";
        public string GenerateQrCode(string uniqCode)
        {

            string fullURL = $"{BaseUrl}{uniqCode}/uniqCode";

            var qr = QrCode.EncodeText(fullURL, QrCode.Ecc.Medium);

            return qr.ToSvgString(4);
        }
    }
}
