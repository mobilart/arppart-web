import React from "react"
import Image from "next/image"
import Link from "next/link"
import arppLogo from "../../public/assets/arpp-logo.svg"
import discordLogo from "../../public/assets/discord-logo.svg"
import twitterLogo from "../../public/assets/twitter-logo.svg"
import styles from "../styles/components/footer.module.css"

const links = [
	{ alt: "Discord logo", src: discordLogo, href: "https://discord.gg/tegk3X3jrH" },
	{ alt: "Arpp logo", src: arppLogo, href: "https://arpp.art/" },
	{ alt: "Twitter logo", src: twitterLogo, href: "https://twitter.com/arpp_art", },
]

export default function Footer() {
	return (
		<footer className={styles.footer}>
			{links.map(({ href, ...imgProps }, i) => (
				<Link key={i} href={href} passHref><Image {...imgProps} /></Link>
			))}
		</footer>
	)
}
