import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalPage } from '@/components/ui/LegalPage';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  return (
    <LegalPage
      title={t('settings.privacyPolicy')}
      updated={t('privacy.lastUpdated')}
      sections={[
        { title: t('privacy.introTitle'), text: t('privacy.introText') },
        { title: t('privacy.collectTitle'), text: t('privacy.collectText'), bullets: [t('privacy.collectItem1'), t('privacy.collectItem2'), t('privacy.collectItem3')] },
        { title: t('privacy.useTitle'), text: t('privacy.useText'), bullets: [t('privacy.useItem1'), t('privacy.useItem2'), t('privacy.useItem3')] },
        { title: t('privacy.storageTitle'), text: t('privacy.storageText') },
        { title: t('privacy.thirdPartyTitle'), text: t('privacy.thirdPartyText') },
        { title: t('privacy.childrenTitle'), text: t('privacy.childrenText') },
        { title: t('privacy.rightsTitle'), text: t('privacy.rightsText'), bullets: [t('privacy.rightsItem1'), t('privacy.rightsItem2'), t('privacy.rightsItem3')] },
        { title: t('privacy.changesTitle'), text: t('privacy.changesText') },
        { title: t('privacy.contactTitle'), text: t('privacy.contactText') },
      ]}
    />
  );
}
