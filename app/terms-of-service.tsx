import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalPage } from '@/components/ui/LegalPage';

export default function TermsOfServiceScreen() {
  const { t } = useTranslation();
  return (
    <LegalPage
      title={t('settings.termsOfService')}
      updated={t('terms.lastUpdated')}
      sections={[
        { title: t('terms.acceptTitle'), text: t('terms.acceptText') },
        { title: t('terms.descTitle'), text: t('terms.descText') },
        { title: t('terms.userTitle'), text: t('terms.userText'), bullets: [t('terms.userItem1'), t('terms.userItem2'), t('terms.userItem3'), t('terms.userItem4')] },
        { title: t('terms.eduTitle'), text: t('terms.eduText') },
        { title: t('terms.ipTitle'), text: t('terms.ipText') },
        { title: t('terms.warrantyTitle'), text: t('terms.warrantyText') },
        { title: t('terms.liabilityTitle'), text: t('terms.liabilityText') },
        { title: t('terms.updatesTitle'), text: t('terms.updatesText') },
        { title: t('terms.changesToTermsTitle'), text: t('terms.changesToTermsText') },
        { title: t('terms.lawTitle'), text: t('terms.lawText') },
        { title: t('terms.contactTitle'), text: t('terms.contactText') },
      ]}
    />
  );
}
