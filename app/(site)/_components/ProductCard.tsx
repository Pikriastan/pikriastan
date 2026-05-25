import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import type { Locale } from "@/lib/i18n/locales";

export function ProductCard({
	product,
	locale,
	index,
}: {
	product: Product;
	locale: Locale;
	index: number;
}) {
	const name = pickLocalized(product.name, locale);
	const cover = product.images[0];
	const second = product.images[1];

	return (
		<Link
			href={`/product/${product.slug}`}
			className="product-card group block fade-up"
			style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
		>
			<div className="relative w-full aspect-[4/5] overflow-hidden bg-paper-deep">
				{cover ? (
					<>
						<Image
							src={cover}
							alt={name}
							fill
							sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
							className="product-card-img object-cover"
							priority={index < 2}
						/>
						{second && (
							<Image
								src={second}
								alt=""
								fill
								sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
								className="second-img absolute inset-0 object-cover"
							/>
						)}
					</>
				) : (
					<div className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
						{"\u2014"}
					</div>
				)}
			</div>
			<div className="mt-5 flex items-baseline justify-between gap-4">
				<h3
					className={`min-w-0 truncate text-base md:text-[17px] ${
						locale === "ka" ? "font-display-ka" : "font-display"
					} tracking-tight`}
				>
					{name}
				</h3>
				<div className="shrink-0 font-mono text-[12px] tracking-tight text-ink/85">
					{formatPrice(product.price, product.currency, locale)}
				</div>
			</div>
		</Link>
	);
}
