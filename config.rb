###
# Blog settings
###

# Time.zone = "UTC"

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"
  blog.permalink = "{number}-{title}.html"
  blog.sources = "{year}-{month}-{day}-{title}.html"
  blog.layout = "article_layout"
  # blog.taglink = "tags/{tag}.html"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  blog.default_extension = ".md"
end

activate :deploy do |deploy|
  deploy.method = :rsync
  deploy.host   = 'fromrailstoember.com'
  deploy.path   = '/src/fromrailstoember.com'
  deploy.user  = 'root'
  deploy.build_before = true
  # deploy.clean = true # remove orphaned files on remote host, default: false
  # deploy.port  = 5309 # ssh port, default: 22
  # deploy.flags = '-rltgoDvzO --no-p --del' # add custom flags, default: -avz
end

page "/feed.xml", layout: false

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :syntax

###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", layout: false
#
# With alternative layout
# page "/path/to/file.html", layout: :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
activate :livereload

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
activate :directory_indexes

compass_config do |config|
  config.add_import_path "./components"
  after_configuration do
    @bower_config = JSON.parse(IO.read("#{root}/.bowerrc"))
    sprockets.append_path File.join "#{root}", @bower_config["directory"]
  end
end

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :relative_assets
  activate :gzip, exts: %w(.js .css .html .htm .svg .ttf .otf .woff .eot)
  activate :imageoptim do |options|
    options.manifest = false
  end
end
