import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Image } from "@nextui-org/react";
import { getCookie, hasCookie } from 'cookies-next'
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navLinks = [
	{
		name: "Home",
		path: "/"
	},

	{
		name: "Loan Requests",
		path: "/requestList"
	},

	{
		name: "Contracts",
		path: "/contractList"
	},

	{
		name: "Users",
		path: "/userList"
	},

	{
		name: "Settings",
		path: "/settings"
	},

	{
		name: "Statistics",
		path: "/stats"
	},

	{
		name: "Payment Guide",
		path: "/howToPay"
	},

	{
		name: "FAQ",
		path: "/faq"
	},

	{
		name: "About",
		path: "/about"
	},
]


export default function SiteNav() {
	const router = useRouter()
	let [user, setUser] = useState()

	useEffect(() => {
		if (hasCookie('user'))
			setUser(JSON.parse(getCookie('user')))
	}, [])

	let navUserItems

	if (! user) {
		navUserItems =
			<>
				<NavbarItem className={((router.pathname) == '/login' ? 'hidden' : '')}>
					<Button as={NextLink} href="/login">Login</Button>
				</NavbarItem>
				<NavbarItem className={((router.pathname) == '/register' ? 'hidden' : '')}>
					<Button as={NextLink} color="primary" href="/register">Sign up</Button>
				</NavbarItem>
			</>
	} else {
		navUserItems =
			<>
				<Dropdown>
					<DropdownTrigger>
						<Button variant="bordered" className="p-2"><FontAwesomeIcon className="h-full w-full mr-1" icon="fa-user fa-solid" />{user.fullName}</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem><span className="font-semibold italic">{user.role.name}</span><br />{user.phone}</DropdownItem>
						<DropdownItem as={NextLink} href="/yourProfile">Your profile</DropdownItem>
						<DropdownItem as={NextLink} href="/logout" className="text-red-600">Log out</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</>
	}

	let navLinksUi = []

	navLinks.forEach((item) => {
		// What nav links to show for non-logged in users
		if (!user && !['/', '/howToPay', '/faq', '/about'].includes(item.path))
			return

		// What nav links to show for admins only (NOT to show for non-admins)
		if (!(user && user.role.id == 1) && ['/userList', '/settings', '/stats'].includes(item.path))
			return

		// What NOT to show for admins
		if ((user && user.role.id == 1) && ['/howToPay', '/faq', '/about'].includes(item.path))
			return

		navLinksUi.push(
			<NavbarItem key={item.path} isActive={router.pathname == item.path}>
				<Link as={NextLink} color="foreground" href={item.path}>{item.name}</Link>
			</NavbarItem>
		)
	})

	return (
		<Navbar maxWidth="xl" position="static">
			<NavbarBrand>
				<NextLink href="/" className="flex flex-row gap-3 place-items-center">
					<Image width={40} src="/img/peery-logo.png" alt="Peery logo" />
					<p className="font-bold text-inherit">PEERY</p>
				</NextLink>
			</NavbarBrand>

			<NavbarContent>
				{navLinksUi}
			</NavbarContent>

			<NavbarContent justify="end">
				{navUserItems}
			</NavbarContent>
		</Navbar>
	);
}