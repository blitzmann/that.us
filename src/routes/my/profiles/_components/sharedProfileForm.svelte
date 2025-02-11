<script context="module">
	import * as yup from 'yup';
	const PHONE_NUMBER_REGEX = /^\+[1-9]\d{6,14}$/;

	const schema = yup.object().shape({
		firstName: yup.string().trim().required('Please add your first name.'),
		lastName: yup.string().trim().required('Please add your last name.'),
		email: yup.string().trim().required('Please add your email address.'),

		city: yup.string().trim().nullable(),
		state: yup.string().trim().nullable(),
		country: yup.string().trim().nullable(),
		phone: yup.string().trim().matches(PHONE_NUMBER_REGEX, 'Invalid Phone Number').nullable(),
		company: yup.string().trim().nullable()
	});
</script>

<script>
	export let handleSubmit;
	export let sharedProfile;

	import { getContext } from 'svelte';
	import { Form, Input } from 'sveltejs-forms';
	import Select from 'svelte-select';
	import MaskInput from 'svelte-input-mask/MaskInput.svelte';

	import ErrorNotificaiton from '$components/notifications/Error.svelte';
	import { Busy } from '$elements';
	import { Shell } from '$elements/buttons';

	const { countryCode } = getContext('COUNTRY_CODES');

	let countryCodeValue = countryCode?.options?.find(({ value }) => value === sharedProfile.country);
</script>

<Form
	{schema}
	initialValues={sharedProfile}
	validateOnBlur={false}
	validateOnChange={false}
	on:submit={handleSubmit}
	let:isSubmitting
	let:isValid
	let:setValue
	let:errors
	let:touched>
	<div>
		<div>
			<h2 class="text-xl font-bold leading-6 text-gray-900">Your Shared Profile</h2>

			<p class="mt-4 text-sm leading-5 text-gray-500">
				Your shared profile is an opportunity for you to change your primary profile information
				with information that you'd rather share with a sponsor.
			</p>

			<p class="mt-4 text-sm leading-5 text-gray-500">
				Below is the information we'll share with sponsors. By default it takes information from
				your main profile. Edit the fields below to change what's shared. This will not change the
				information on your main profile.
			</p>
		</div>

		<div class="px-4">
			<div class="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
				<div class="sm:col-span-3">
					<label for="firstName" class="block text-sm font-medium leading-5 text-gray-700">
						First or Given Name
					</label>
					<div class="relative">
						<span
							class="absolute top-0 left-0 block h-2 w-2 -translate-x-4 -translate-y-4 transform rounded-full bg-red-400" />
					</div>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="firstName"
							type="text"
							autofocus
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="lastName" class="block text-sm font-medium leading-5 text-gray-700">
						Last or Family Name
					</label>
					<div class="relative">
						<span
							class="absolute top-0 left-0 block h-2 w-2 -translate-x-4 -translate-y-4 transform rounded-full bg-red-400" />
					</div>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="lastName"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>

				<div class="sm:col-span-6">
					<label for="email" class="block text-sm font-medium leading-5 text-gray-700">
						Email address
					</label>
					<div class="relative">
						<span
							class="absolute top-0 left-0 block h-2 w-2 -translate-x-4 -translate-y-4 transform rounded-full bg-red-400" />
					</div>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="email"
							type="email"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>

				<div class="relative py-6 sm:col-span-6">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-300" />
					</div>
					<div class="relative flex justify-center">
						<span class="bg-gray-100 px-6 text-sm uppercase text-gray-500"> Optional Fields </span>
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="city" class="block text-sm font-medium leading-5 text-gray-700"> City </label>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="city"
							type="text"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="state" class="block text-sm font-medium leading-5 text-gray-700">
						State
					</label>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="state"
							type="text"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="state" class="block text-sm font-medium leading-5 text-gray-700">
						Country
					</label>
					<div class="mt-1 rounded-md border shadow-sm">
						<Select
							inputAttributes={{
								name: 'country'
							}}
							inputStyles="form-multiselect transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:border-gray-700"
							items={countryCode.options}
							value={countryCodeValue}
							on:select={({ detail }) => setValue('country', detail.value)}
							on:clear={() => setValue('country', null)}
							hasError={touched['country'] && errors['country']} />
					</div>
					{#if touched['country'] && errors['country']}
						<p class="italic text-red-600">{errors['country']}</p>
					{/if}
				</div>

				<div class="sm:col-span-3">
					<label for="about" class="block text-sm font-medium leading-5 text-gray-700">
						Phone Number
					</label>
					<div class="mt-1 rounded-md border shadow-sm">
						<MaskInput
							name="phone"
							alwaysShowMask
							mask="+0 (000) 000 - 0000"
							size={20}
							showMask
							maskChar="_"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
							value={sharedProfile.phone || undefined}
							on:change={({ detail: { inputState } }) => {
								if (inputState.unmaskedValue.length === 0) setValue('phone', null);
								else setValue('phone', `+${inputState.unmaskedValue}`);
							}} />
					</div>
					{#if touched['phone'] && errors['phone']}
						<p class="italic text-red-600">{errors['phone']}</p>
					{/if}
				</div>

				<div class="sm:col-span-3">
					<label for="company" class="block text-sm font-medium leading-5 text-gray-700">
						Company
					</label>
					<div class="mt-1 rounded-md border shadow-sm">
						<Input
							name="company"
							type="text"
							class="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
					</div>
				</div>
			</div>
		</div>

		{#if !isSubmitting}
			<div class="mt-8 border-t border-gray-200 pt-5">
				<div class="flex justify-end space-x-4">
					<div class="flex">
						<Shell>
							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full px-8 py-2 text-sm font-medium leading-5">
								<span>Update Shared Profile</span>
							</button>
						</Shell>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-grow justify-center py-12">
				<Busy />
			</div>
		{/if}

		{#if isValid === false}
			<ErrorNotificaiton message="Please correct the errors listed above." />
		{/if}
	</div>
</Form>
