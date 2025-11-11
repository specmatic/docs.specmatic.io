# Fork of https://github.com/Ovski4/jekyll-tabs
# Used because the default template generates warnings for htmlproofer because of `<a href="#">` links for the tab headers, which technically points to nowhere
require 'securerandom'
require 'erb'

def sanitizeName(name)
    return name
        .strip                  # remove leading and trailing whitespace
        .downcase               # lowercase
        .gsub(/[^0-9a-z]/, '-') # replace all non alphabjetical or non numerical characetrs by a dash
end

module Jekyll
    module Tabs
        class TabsBlock < Liquid::Block
            def initialize(block_name, markup, tokens)
                super
                if markup == ''
                    raise SyntaxError.new("Block #{block_name} requires 1 attribute")
                end
                # the contents of the markup after `tabs` {% tab ... %}
                @markup = markup.strip
            end

            def render(context)
                environment = context.environments.first
                super

                # Render the markup through Liquid to resolve variables
                begin
                    rendered_markup = Liquid::Template.parse(@markup).render(context)
                    @name = sanitizeName(rendered_markup)
                rescue Liquid::SyntaxError => e
                    # Fallback: treat as literal string if it's not valid Liquid
                    @name = sanitizeName(@markup)
                end

                uuid = SecureRandom.uuid
                currentDirectory = File.dirname(__FILE__)
                templateFile = File.read(currentDirectory + '/_jekyll-tabs-specmatic.erb')
                template = ERB.new(templateFile)
                template.result(binding)
            end
        end

        class TabBlock < Liquid::Block
            alias_method :render_block, :render

            def initialize(block_name, markup, tokens)
                super
                # the contents of the markup after `tab` {% tab ... %}
                @markup = markup.strip
            end

            def render(context)
                site = context.registers[:site]
                converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
                environment = context.environments.first

                # Render the name markup through Liquid to resolve variables
                name = begin
                    rendered_name = Liquid::Template.parse(@markup).render(context)
                    sanitizeName(rendered_name)
                rescue Liquid::SyntaxError => e
                    # Fallback: treat as literal string if it's not valid Liquid
                    sanitizeName(@markup)
                end

                markups = rendered_name.split(' ', 2)
                if markups.length != 2
                    raise SyntaxError.new("Block tab requires 2 attributes: name and tab")
                end
                @name = sanitizeName(markups[0])
                @tab = markups[1].strip

                environment["tabs-#{@name}"] ||= {}
                environment["tabs-#{@name}"][@tab] = converter.convert(render_block(context))
            end
        end
    end
end

Liquid::Template.register_tag('tab', Jekyll::Tabs::TabBlock)
Liquid::Template.register_tag('tabs', Jekyll::Tabs::TabsBlock)
