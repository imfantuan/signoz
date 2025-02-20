import { notification } from 'antd';
import get from 'api/alerts/get';
import Spinner from 'components/Spinner';
import ROUTES from 'constants/routes';
import EditRulesContainer from 'container/EditRules';
import history from 'lib/history';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

function EditRules(): JSX.Element {
	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const ruleId = params.get('ruleId');

	const { t } = useTranslation('common');

	const isValidRuleId = ruleId !== null && String(ruleId).length !== 0;

	const { isLoading, data, isError } = useQuery(['ruleId', ruleId], {
		queryFn: () =>
			get({
				id: parseInt(ruleId || '', 10),
			}),
		enabled: isValidRuleId,
	});

	useEffect(() => {
		if (!isValidRuleId) {
			notification.error({
				message: 'Rule Id is required',
			});
			history.replace(ROUTES.LIST_ALL_ALERT);
		}
	}, [isValidRuleId, ruleId]);

	if (
		(isError && !isValidRuleId) ||
		ruleId == null ||
		(data?.payload?.data === undefined && !isLoading)
	) {
		return <div>{data?.error || t('something_went_wrong')}</div>;
	}

	if (isLoading || !data?.payload) {
		return <Spinner tip="Loading Rules..." />;
	}

	return <EditRulesContainer ruleId={ruleId} initialData={data.payload.data} />;
}

export default EditRules;
