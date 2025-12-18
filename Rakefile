
desc "build"
task :build do
  sh("bundle exec jekyll build")
end


def should_not_run_external_url_checks?
  if ENV['CI']
    false
  else
    ENV['RUN_EXTERNAL_CHECKS'].nil? || ENV['RUN_EXTERNAL_CHECKS'] == 'false'
  end
end

desc "Validate all links"
task :check do
  require 'html-proofer'
  options = {
    disable_external: should_not_run_external_url_checks?,
    ignore_urls:          [
      /http:\/\/localhost/,
      /http:\/\/127\.0\.0\.1/,
      /https:\/\/www\.youtube\.com\//,
      /https:\/\/github\.com\// # ignore github links as they often have rate limiting issues
    ],
    allow_hash_href:       false,
    allow_missing_href:    true,
    check_external_hash:   false,
    validation:            {
      report_invalid_tags:   false,
      report_script_embeds:  false,
      report_missing_names:  false ,
    },
    typhoeus:  {
      # verbose:  true,
      followlocation:  true,
      connecttimeout:  500,
      accept_encoding: "gzip",
      # pretend to be a real browser
      headers: { "User-Agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0" }
    },
    hydra:  { max_concurrency: 2 },
    ignore_missing_alt:  true,
    log_level:  :info,

  }

  STDERR.puts "WARNING: Not checking outbound links. Set environment variable: " +
  "RUN_EXTERNAL_CHECKS to 'true' to run them" if should_not_run_external_url_checks?

  puts "\nRunning link checks, html format and verifying that it can be hosted in a subdirectory (relative links):"

  HTMLProofer.check_directory('_site', options).run
end
