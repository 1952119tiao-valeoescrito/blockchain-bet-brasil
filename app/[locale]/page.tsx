import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage'); // Carrega a seção "HomePage" do JSON

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <p>{t('connect_prompt')}</p>
      {/* O resto da sua página */}
    </div>
  );
}