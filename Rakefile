require 'html-proofer'

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

options = {
    :disable_external     => should_not_run_external_url_checks?,
    :ignore_urls          => [/(https?:\/\/localhost|([a-z0-9:\/-]*:8153)|([a-zA-z@:\/_]*.git)|docs\.gocd\.org|stackexchange\.com|pkgs\.org)/],
    :allow_hash_href      => false,
    :allow_missing_href   => true,
    :check_external_hash  => false,
    :href_ignore          => ['/https:\/\/www\.youtube\.com\/.*/'],
    :validation           => {
        :report_invalid_tags  => false,
        :report_script_embeds => false,
        :report_missing_names => false ,
    },
    :typhoeus => {
        :followlocation => true,
        :connecttimeout => 500,
    },
    :ignore_missing_alt   => true,
    :log_level            => :info,
    :checks => ['Links', 'Images']
}

task :check do
  STDERR.puts "WARNING: Not checking outbound links. Set environment variable: " +
                  "RUN_EXTERNAL_CHECKS to 'true' to run them" if should_not_run_external_url_checks?

  puts "\nRunning link checks, html format and verifying that it can be hosted in a subdirectory (relative links):"

  HTMLProofer.check_directory('_site', options).run
end
