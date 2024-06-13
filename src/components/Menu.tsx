import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { links } from "../utils/constants";

function Menu({ url }: { url?: URL }) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	return (
		<>
			<div ref={ref}></div>
			<button
				className="ml-auto block focus:outline-none focus:ring focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-gray-900 md:hidden"
				onClick={() => setIsOpen(true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-slate-50"
				>
					<path d="M3 3h18"></path>
					<path d="M20 7H8"></path>
					<path d="M20 11H8"></path>
					<path d="M10 19h10"></path>
					<path d="M8 15h12"></path>
					<path d="M4 3v14"></path>
					<circle cx="4" cy="19" r="2"></circle>
				</svg>
			</button>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsOpen(false)}
					initialFocus={ref}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full justify-end text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-x-8"
								enterTo="opacity-100 translate-x-0"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-x-0"
								leaveTo="opacity-0 translate-x-8"
							>
								<Dialog.Panel className="w-60 transform overflow-hidden bg-primary-dark p-6 text-left align-middle shadow-xl shadow-orange-400 transition-all">
									<nav className="text-primary flex flex-col items-start space-y-4 text-lg transition-colors delay-75 ease-in-out">
										{links(url ?? new URL(window.location.href)).map((link) => (
											<a
												key={link.text}
												className={`hover:text-orange-600 ${
													link.highlighted
														? "font-semibold dark:text-primary-light"
														: "font-normal dark:text-slate-400"
												}`}
												href={link.href}
											>
												{link.text}
											</a>
										))}
									</nav>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

export default Menu;
