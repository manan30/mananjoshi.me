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
				className="block rounded-md border border-white/15 p-1.5 text-slate-100 focus:outline-none focus:ring focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-slate-900 md:hidden"
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
						<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
								<Dialog.Panel className="w-64 transform overflow-hidden rounded-l-2xl border-l border-white/10 bg-slate-900 p-6 text-left align-middle shadow-xl shadow-black/40 transition-all">
									<nav className="flex flex-col items-start space-y-2 text-base transition-colors">
										{links(url ?? new URL(window.location.href)).map((link) => (
											<a
												key={link.text}
												className={`w-full rounded-lg px-3 py-2 transition ${
													link.highlighted
														? "bg-white/10 font-medium text-slate-100"
														: "font-normal text-slate-300 hover:bg-white/5 hover:text-orange-300"
												}`}
												aria-current={link.highlighted ? "page" : undefined}
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
