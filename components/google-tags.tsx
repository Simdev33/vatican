import Script from "next/script"

export function GoogleTags() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const tagId = gaMeasurementId ?? googleAdsId

  if (!tagId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          ${gaMeasurementId ? `gtag('config', '${gaMeasurementId}');` : ""}
          ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
        `}
      </Script>
    </>
  )
}
