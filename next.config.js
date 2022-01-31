const { NEXT_PUBLIC_IMAGE_DOMAINS } = process.env
module.exports = {
	reactStrictMode: true,

	images: {
		domains: NEXT_PUBLIC_IMAGE_DOMAINS ? [...NEXT_PUBLIC_IMAGE_DOMAINS.split(",")] : [],
	},
}
