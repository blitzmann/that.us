<script context="module">
	export async function load({ stuff }) {
		return {
			props: {
				...stuff
			}
		};
	}
</script>

<script>
	export let events;
	export let activeEvents;
	export let isBackdoor;
	export let eventId;

	import { goto } from '$app/navigation';
	import Typewriter from 'svelte-typewriter';
	import Icon from 'svelte-awesome';
	import { plus } from '$components/svelte-awesome-icons';

	import seoMetaTags from '$utils/seo/metaTags';
	import Seo from '$components/Seo.svelte';
	import logEvent from '$utils/eventTrack';
	import sessionsApi from '$dataSources/api.that.tech/sessions/mutations';
	import { ActionHeader } from '$elements';
	import { Standard as StandardLink } from '$elements/links';
	import StackedLayout from '$elements/layouts/StackedLayout.svelte';
	import Nav from '$components/nav/interiorNav/Top.svelte';

	import ActivityForm from '../_components/form/ActivityForm.svelte';
	import { formatCreate } from '../_lib/formatRequest';

	const metaTags = ((title = `Create a new activitiy for THAT or THAT Conference.`) => ({
		title,
		tags: seoMetaTags({
			title,
			description: 'Create a New [Activity, Code Review, Open Space, Chat], you get the idea.',
			openGraph: {
				type: 'website',
				url: `https://that.us/activities/create/`
			}
		})
	}))();

	const { createSession } = sessionsApi();

	async function handleSubmit({ detail: { values, setSubmitting, resetForm } }) {
		setSubmitting(true);

		const { eventId } = values;
		const { activity, type } = formatCreate(values);

		await createSession(eventId, type, activity);

		logEvent('activity_created');

		resetForm();
		setSubmitting(false);
		goto('/my/submissions/');
	}
</script>

<Seo title={metaTags.title} tags={metaTags.tags} />

<StackedLayout bodyBackgroundColor="bg-gray-100">
	<div slot="header">
		<Nav />
		<ActionHeader>
			<div class="flex space-x-2" slot="title">
				<span>Create a new</span>
				<div class="italic text-that-orange">
					<Typewriter loop cursor="white" interval={[50, 60, 80]}>
						<span>Room.</span>
						<span>Presentation.</span>
						<span>Open Space.</span>
						<span>Code Review.</span>
						<span>Panel Discussion.</span>
						<span>Office Hours.</span>
						<span>Chat.</span>
						<span>Q&A.</span>
						<span>AMA.</span>
						<span>you decide.</span>
					</Typewriter>
				</div>
			</div>
		</ActionHeader>
	</div>

	<div slot="body">
		<div
			class="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
			<div class="flex items-center space-x-5">
				<div class="flex-shrink-0">
					<div class="relative text-that-blue">
						<Icon data={plus} class="h-16 w-16 rounded-full" />
					</div>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Create Activity</h1>
					<p class="text-sm font-medium text-gray-500">
						Below is a short set of questions to best schedule a new activity.
					</p>
				</div>
			</div>
			<div
				class="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
				<StandardLink href="/my/submissions/">View Your Past Submissions</StandardLink>
			</div>
		</div>

		<div class="mx-auto mt-8 max-w-3xl sm:px-6 lg:max-w-7xl">
			<ActivityForm {handleSubmit} {activeEvents} {events} {isBackdoor} {eventId} isEdit={false} />
		</div>
	</div>
</StackedLayout>
