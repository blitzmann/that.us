<script context="module">
	import partnersApi from '$dataSources/api.that.tech/partner/queries';

	export async function load({ fetch }) {
		const { getPastPartners } = partnersApi(fetch);

		return {
			props: {
				partners: await getPastPartners()
			}
		};
	}
</script>

<script>
	export let partners;

	import seoMetaTags from '$utils/seo/metaTags';

	import Seo from '$components/Seo.svelte';
	import PartnerCard from '$components/partners/PartnerCard.svelte';
	import Layout from '$elements/layouts/ContentLayout.svelte';

	import Hero from '../_components/_PastPartnersHero.svelte';

	const metaTags = ((
		title = `Visit all of our past sponsors who've helped make THAT Conference possible.`
	) => ({
		title,
		tags: seoMetaTags({
			title,
			description: 'Thank you to those who support our great community every day.',
			openGraph: {
				type: 'website',
				url: `https://that.us/partners/past`
			}
		})
	}))();
</script>

<Seo title={metaTags.title} tags={metaTags.tags} />

<Layout>
	<main class="overflow-hidden">
		<div class="relative pb-16 md:pb-20 lg:pb-24 xl:pb-32">
			<div class="mx-auto mt-32 max-w-screen-xl px-4 sm:px-6 xl:mt-40">
				<Hero />
				<div class="mt-12 py-12">
					<ul class="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each partners as p, i (p.id)}
							<li
								class="col-span-1 flex transform flex-col rounded-lg bg-white text-center shadow transition duration-500 ease-in-out hover:scale-105 hover:bg-that-offWhite">
								<a open href={`/partners/${p.slug}`}>
									<PartnerCard {...p} />
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</main>
</Layout>
