/** @type {import('next').NextConfig} */


const transpileModules = ['electron-serve']

module.exports = {
  trailingSlash: true,
  transpilePackages: transpileModules,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}

