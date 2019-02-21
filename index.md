---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<ul>
  {% assign collections = site.collections | sort: 'sequence' %}
  {% for collection in collections %}
    {% if collection.label != "posts" %}
    <li>
      {% assign name = collection.label %}
      <section>
        <h3>{{ collection.title}}</h3>
	  	<ol>
   		 {% for page in site[name] %}
		 <li>
		 <a href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a>
		 </li>
    	 {% endfor %}
		</ol>
  	  </section>
    </li>
    {%- endif -%}
  {% endfor %}
</ul>
