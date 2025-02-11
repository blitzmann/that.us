import gFetch from '$utils/gfetch';

import { log } from '../utilities/error';

const enumValues = `
	options: enumValues {
		label: description
		value: name
	}
`;

export const QUERY_SESSION_DROPDOWN_VALUES = `
	query QUERY_SESSION_DROPDOWN_VALUES {
		duration: __type(name: "Duration") {
			${enumValues}
		}

		targetAudience: __type(name: "TargetAudience") {
			${enumValues}
		}
		
		assetLinkType: __type(name: "AssetLinkType") {
			${enumValues}
		}
		
		category: __type(name: "Category") {
			${enumValues}
		}
		
		entityType: __type(name: "EntityType") {
			${enumValues}
		}
		
		mentorship: __type(name: "Mentorship") {
			${enumValues}
		}
		
		sessionCategory: __type(name: "SessionCategory") {
			${enumValues}
		}

		sessionLocationDestinations: __type(name: "SessionLocationDestination") {
			${enumValues}
		}
		
		sessionType: __type(name: "SessionType") {
			${enumValues}
		}
		
		status: __type(name: "Status") {
			${enumValues}
		}
		
		targetAudience: __type(name: "TargetAudience") {
			${enumValues}
		}
		
		targetLocation: __type(name: "TargetLocation") {
			${enumValues}
		}
	}
`;

const onBaseFields = `
	fragment onBaseFields on Base {
		id
		eventId
		event {
			id
			startDate
			endDate
		}
		slug
		title
		shortDescription
		primaryCategory
		type
		targetAudience
		targetLocation
		status
		durationInMinutes
		startTime
		location {
			destination
			isOnline
			url
		}
		tags
		takeaways
		supportingArtifacts {
			name
			url
			description
		}
		createdAt
		lastUpdatedAt
		isMinor
	}
`;

const onEyesFrontFields = `
	fragment onEyesFrontFields on EyesFront {
		longDescription
		whyAreYou
		otherComments
		mentorship
		secondaryCategory
		canRecord
		isRecorded
		category
	}
`;

const onWorkshopFields = `
	fragment onWorkshopFields on Workshop {
		prerequisites
		agenda
		duration
	}
`;

const onRegularFields = `
	fragment onRegularFields on Regular {
		prerequisites
	}
`;

const onKeynoteFields = `
	fragment onKeynoteFields on Keynote {
		agenda
	}
`;

export const QUERY_MY_SESSION_BY_ID = `
	${onBaseFields}
	${onEyesFrontFields}
	${onWorkshopFields}
	${onRegularFields}
	${onKeynoteFields}
	query QUERY_MY_SESSION_BY_ID($sessionId: ID!) {
		sessions {
			me {
				session(id: $sessionId) {
					...onBaseFields
					...onEyesFrontFields
					...onWorkshopFields
					...onRegularFields
					...onKeynoteFields
				}
			}
		}
	}
`;

export default (fetch) => {
	const client = fetch ? gFetch(fetch) : gFetch();

	function querySessionDropDownValues() {
		const variables = {};

		return client
			.query({ query: QUERY_SESSION_DROPDOWN_VALUES, variables })
			.then(({ data, errors }) => {
				if (errors) log({ errors, tag: 'QUERY_SESSION_DROPDOWN_VALUES' });

				return data;
			});
	}

	function queryMySessionById(sessionId) {
		const variables = { sessionId };

		return client
			.secureQuery({ query: QUERY_MY_SESSION_BY_ID, variables })
			.then(({ data, errors }) => {
				if (errors) log({ errors, tag: 'QUERY_MY_SESSION_BY_ID' });

				return data.sessions?.me?.session;
			});
	}

	return { querySessionDropDownValues, queryMySessionById };
};
