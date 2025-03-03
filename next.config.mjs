/** @type {import('next').NextConfig} */

const nextConfig = {
     eslint: {
       ignoreDuringBuilds: true,
     },
     api: {
       bodyParser: {
         sizeLimit: "20mb",
       },
     },
   };
   
export default nextConfig;
   