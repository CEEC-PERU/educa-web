/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // aquí permites el dominio de Cloudinary
  },
  reactStrictMode: true,
  // se emplea un rewrite para redirigir las solicitudes al CDN
  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination: "https://cdn.mentormind.com.pe/:path*",
      },
    ];
  },
};

export default nextConfig;
