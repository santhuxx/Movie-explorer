import React from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import LegalPage from '../components/LegalPage';
import { SITE_URL } from '../components/Seo';
import { getGuide, GUIDES_UPDATED } from './guidesData';

const GuideArticle = () => {
  const { slug } = useParams();
  const guide = getGuide(slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <LegalPage
      title={guide.title}
      description={guide.description}
      path={`/guides/${guide.slug}`}
      lastUpdated={GUIDES_UPDATED}
      sections={guide.sections}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        dateModified: '2026-09-20',
        author: { '@type': 'Organization', name: 'Flickx' },
        publisher: { '@type': 'Organization', name: 'Flickx', url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
      }}
      footerNote={
        <Typography variant="body2" color="text.secondary">
          More in{' '}
          <Link component={RouterLink} to="/guides" underline="hover">
            Guides
          </Link>
        </Typography>
      }
    />
  );
};

export default GuideArticle;
