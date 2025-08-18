import { getPublishedPages } from '@/actions/cms';
import Link from 'next/link';

const Footer = async () => {
	const pages = await getPublishedPages();

	return (
		<footer className="bg-white dark:bg-gray-900 pt-[120px]">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0">
						<Link href="/" className="flex items-center">
							<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
								MySaaS
							</span>
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Pages
							</h2>
							<ul className="text-gray-500 dark:text-gray-400 font-medium">
								<li className="mb-4">
									<Link href="/" className="hover:underline">
										Home
									</Link>
								</li>
								{pages &&
									pages.map((page) => (
										<li key={page.slug} className="mb-4">
											<Link
												href={`/${page.slug}`}
												className="hover:underline">
												{page.title}
											</Link>
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
						© 2025 MySaaS. All rights reserved.
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
