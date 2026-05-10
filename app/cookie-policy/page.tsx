import Link from "next/link"

export default function CookiePolicyPage() {
  const miscCookies = [
    "siteContentEvent",
    "WP_DATA_USER_2",
    "jetDasboardData",
    "e_kit-elements-defaults",
    "cp_challenge",
    "trp_language",
    "_scc_session",
    "cmplz_policy_id (365 days)",
    "wp_consent_statistics",
    "wp_consent_statistics-anonymous",
    "cmplz_task_filter (365 days)",
    "__stripe_sid",
    "cmplz_consented_services (365 days)",
    "wp_consent_marketing",
    "wp_consent_preferences",
    "wp_consent_functional",
    "cmplz_banner-status (365 days)",
    "i18nextLng",
    "adobeCleanFontAdded",
    "x-visitor-id",
    "cookie_warning_dismissed",
    "cookie_terms_accepted",
    "persist:hs-beacon-44cc73fb-7636-4206-b115-c7b33823551b",
    "wpr-show-sidebar",
    "persist:hs-beacon-message-44cc73fb-7636-4206-b115-c7b33823551b",
    "wpr-hash",
    "wistia",
    "wistia-video-progress-7seqacq2ol",
    "wistia-video-progress-fj42vucf99",
    "wistia-video-progress-j042jylrre",
    "wistia-video-progress-z1qxl7s2zn",
    "persist:hs-beacon-session-44cc73fb-7636-4206-b115-c7b33823551b",
    "ameliaRangePast",
    "ameliaRangeFuture",
    "WP_DATA_USER_1",
    "_gcl_ls",
    "e_site-editor",
    "_gcl_au",
    "_grecaptcha",
    "hjActiveViewportIds",
    "_hjSessionUser_6532086",
    "_hjSession_6532086",
    "hjViewportId",
    "mp_150605b3b9f979922f2ac5a52e2dcfe9_mixpanel",
    "mp_gen_new_tab_id_mixpanel_150605b3b9f979922f2ac5a52e2dcfe9",
    "mp_tab_id_mixpanel_150605b3b9f979922f2ac5a52e2dcfe9",
    "wfwaf-authcookie-e53f1f266ac00c12cef222799e6bbe7c",
    "__cf_bm",
    "ads_sent_1737",
    "ads_sent_1735",
    "ads_sent_1736",
    "ip2location_redirection_first_visit",
    "ameliaLastOrder",
    "intercom.intercom-state-d5v9p9vg",
    "wp-ad-feedback-nps",
    "intercom-id-d5v9p9vg",
    "intercom-session-d5v9p9vg",
    "intercom-device-id-d5v9p9vg",
    "PHPSESSID",
    "nitroCachedPage",
    "/wp-admin/admin.php-elfinder-lastdirwp_file_manager",
    "/wp-admin/admin.php-elfinder-toolbarhideswp_file_manager",
    "_fs_uid",
    "_fs_tab_id",
    "fs_uid",
    "_fs_lua",
    "fs_lua",
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cookie Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          <strong>Last updated:</strong> April 28, 2026
          <br />
          This Cookie Policy applies to citizens and legal permanent residents of the European Economic Area and
          Switzerland.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-2">
              Our website, <strong>https://paristourpass.com</strong> (hereinafter: &ldquo;the website&rdquo;) uses
              cookies and other related technologies (for convenience all technologies are referred to as
              &ldquo;cookies&rdquo;). Cookies are also placed by third parties we have engaged. In the document below
              we inform you about the use of cookies on our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">2. What are cookies?</h2>
            <p className="mt-2">
              A cookie is a small simple file that is sent along with pages of this website and stored by your browser
              on the hard drive of your computer or another device. The information stored therein may be returned to
              our servers or to the servers of the relevant third parties during a subsequent visit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">3. What are scripts?</h2>
            <p className="mt-2">
              A script is a piece of program code that is used to make our website function properly and
              interactively. This code is executed on our server or on your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">4. What is a web beacon?</h2>
            <p className="mt-2">
              A web beacon (or a pixel tag) is a small, invisible piece of text or image on a website that is used to
              monitor traffic on a website. In order to do this, various data about you is stored using web beacons.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">5. Cookies</h2>
            <h3 className="mt-3 font-semibold text-slate-900">5.1 Technical or functional cookies</h3>
            <p className="mt-1">
              Some cookies ensure that certain parts of the website work properly and that your user preferences remain
              known. By placing functional cookies, we make it easier for you to visit our website. This way, you do
              not need to repeatedly enter the same information when visiting our website and, for example, the items
              remain in your shopping cart until you have paid. We may place these cookies without your consent.
            </p>

            <h3 className="mt-4 font-semibold text-slate-900">5.2 Statistics cookies</h3>
            <p className="mt-1">Because statistics are being tracked anonymously, no permission is asked to place statistics cookies.</p>

            <h3 className="mt-4 font-semibold text-slate-900">5.3 Marketing/Tracking cookies</h3>
            <p className="mt-1">
              Marketing/Tracking cookies are cookies or any other form of local storage, used to create user profiles
              to display advertising or to track the user on this website or across several websites for similar
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">6. Placed cookies</h2>

            <div className="mt-4 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">Elementor</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Statistics (anonymous)
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-slate-200">
                          <td className="px-3 py-2 font-mono text-xs">elementor</td>
                          <td className="px-3 py-2">persistent</td>
                          <td className="px-3 py-2">Store performed actions on the website</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">WordPress</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Functional
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">WP_PREFERENCES_USER_*</td>
                        <td className="px-3 py-2">persistent</td>
                        <td className="px-3 py-2">Store user preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wpEmojiSettingsSupports</td>
                        <td className="px-3 py-2">session</td>
                        <td className="px-3 py-2">Store browser details</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wp-settings-*</td>
                        <td className="px-3 py-2">persistent</td>
                        <td className="px-3 py-2">Store user preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wp-settings-time-*</td>
                        <td className="px-3 py-2">1 year</td>
                        <td className="px-3 py-2">Store user preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wordpress_test_cookie</td>
                        <td className="px-3 py-2">session</td>
                        <td className="px-3 py-2">Read if cookies can be placed</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wp_lang</td>
                        <td className="px-3 py-2">session</td>
                        <td className="px-3 py-2">Store language settings</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">wordpress_logged_in_*</td>
                        <td className="px-3 py-2">persistent</td>
                        <td className="px-3 py-2">Store logged in users</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Go Daddy</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Statistics
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">_tccl_visitor</td>
                        <td className="px-3 py-2">1 year</td>
                        <td className="px-3 py-2">Store anonymized statistics</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">_tccl_visit</td>
                        <td className="px-3 py-2">30 minutes</td>
                        <td className="px-3 py-2">Store anonymized statistics</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Google Analytics</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Statistics
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">_ga</td>
                        <td className="px-3 py-2">2 years</td>
                        <td className="px-3 py-2">Store and count pageviews</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">_ga_*</td>
                        <td className="px-3 py-2">1 year</td>
                        <td className="px-3 py-2">Store and count pageviews</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Stripe</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Functional
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">__stripe_mid</td>
                        <td className="px-3 py-2">1 year</td>
                        <td className="px-3 py-2">Provide fraud prevention</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Complianz</h3>
                <p className="mt-1">
                  <strong>Usage:</strong> Functional
                  <br />
                  <strong>Sharing data:</strong> This data is not shared with third parties. For more information,
                  please read the Complianz Privacy Statement.
                </p>
                <details className="mt-2 rounded-lg border border-slate-200">
                  <summary className="cursor-pointer list-none bg-slate-100 px-3 py-2 font-medium text-slate-800">
                    Show cookie table
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Expiration</th>
                          <th className="px-3 py-2 font-semibold">Function</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">cmplz_functional</td>
                        <td className="px-3 py-2">365 days</td>
                        <td className="px-3 py-2">Store cookie consent preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">cmplz_statistics</td>
                        <td className="px-3 py-2">365 days</td>
                        <td className="px-3 py-2">Store cookie consent preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">cmplz_preferences</td>
                        <td className="px-3 py-2">365 days</td>
                        <td className="px-3 py-2">Store cookie consent preferences</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-3 py-2 font-mono text-xs">cmplz_marketing</td>
                        <td className="px-3 py-2">365 days</td>
                        <td className="px-3 py-2">Store cookie consent preferences</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>

              <details className="rounded-lg border border-slate-200 p-3">
                <summary className="cursor-pointer list-none font-semibold text-slate-900">
                  Miscellaneous (Purpose pending investigation)
                </summary>
                <p className="mt-2">
                  <strong>Sharing data:</strong> Sharing of data is pending investigation.
                </p>
                <p className="mt-2 italic">
                  The following cookies are currently pending classification regarding their specific expiration and
                  function:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {miscCookies.map((cookie) => (
                    <li key={cookie}>
                      <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{cookie}</code>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">7. Consent</h2>
            <p className="mt-2">
              When you visit our website for the first time, we will show you a pop-up with an explanation about
              cookies. As soon as you click on &ldquo;Save preferences&rdquo;, you consent to us using the categories
              of cookies and plug-ins you selected in the pop-up, as described in this Cookie Policy. You can disable
              the use of cookies via your browser, but please note that our website may no longer work properly.
            </p>
            <h3 className="mt-4 font-semibold text-slate-900">7.1 Manage your consent settings</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Functional (Always active):</strong> The technical storage or access is strictly necessary for
                the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber
                or user, or for the sole purpose of carrying out the transmission of a communication over an electronic
                communications network.
              </li>
              <li>
                <strong>Preferences:</strong> The technical storage or access is necessary for the legitimate purpose
                of storing preferences that are not requested by the subscriber or user.
              </li>
              <li>
                <strong>Statistics:</strong> The technical storage or access that is used exclusively for anonymous
                statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service
                Provider, or additional records from a third party, information stored or retrieved for this purpose
                alone cannot usually be used to identify you.
              </li>
              <li>
                <strong>Marketing:</strong> The technical storage or access is required to create user profiles to send
                advertising, or to track the user on a website or across several websites for similar marketing
                purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">8. Enabling/disabling and deleting cookies</h2>
            <p className="mt-2">
              You can use your internet browser to automatically or manually delete cookies. You can also specify that
              certain cookies may not be placed. Another option is to change the settings of your internet browser so
              that you receive a message each time a cookie is placed. For more information about these options, please
              refer to the instructions in the Help section of your browser.
            </p>
            <p className="mt-2">
              Please note that our website may not work properly if all cookies are disabled. If you do delete the
              cookies in your browser, they will be placed again after your consent when you visit our website again.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">9. Your rights with respect to personal data</h2>
            <p className="mt-2">You have the following rights with respect to your personal data:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                You have the right to know why your personal data is needed, what will happen to it, and how long it
                will be retained for.
              </li>
              <li>
                <strong>Right of access:</strong> You have the right to access your personal data that is known to us.
              </li>
              <li>
                <strong>Right to rectification:</strong> you have the right to supplement, correct, have deleted or
                blocked your personal data whenever you wish.
              </li>
              <li>
                If you give us your consent to process your data, you have the right to revoke that consent and to have
                your personal data deleted.
              </li>
              <li>
                <strong>Right to transfer your data:</strong> you have the right to request all your personal data from
                the controller and transfer it in its entirety to another controller.
              </li>
              <li>
                <strong>Right to object:</strong> you may object to the processing of your data. We comply with this,
                unless there are justified grounds for processing.
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us. Please refer to the contact details at the bottom of this
              Cookie Policy. If you have a complaint about how we handle your data, we would like to hear from you, but
              you also have the right to submit a complaint to the supervisory authority (the Data Protection
              Authority).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">10. Contact details</h2>
            <p className="mt-2">
              For questions and/or comments about our Cookie Policy and this statement, please contact us by using the
              following contact details:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>TicketCompass OÜ</strong>
              </li>
              <li>Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn</li>
              <li>Estonia</li>
              <li>
                <strong>Tax Number:</strong> EE102778049
              </li>
              <li>
                <strong>Company Register:</strong> 17069651
              </li>
              <li>
                <strong>Website:</strong> https://paristourpass.com
              </li>
              <li>
                <strong>Email:</strong> info@paristourpass.com
              </li>
            </ul>
          </section>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-medium text-[#1a365d] hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
