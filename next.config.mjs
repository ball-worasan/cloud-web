// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'file.royalrain.go.th',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'file.royalrain.go.th',
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
