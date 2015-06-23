require 'json'
key = JSON.load File.new('secrets.json')
req_url = "http://www.giantbomb.com/api/search?format=json&query=final%20fantasy&resources=game&limit=5&api_key=#{key['key']}"
response = HTTParty.get(req_url)
response["results"].each do |res|
  Game.create(name: res["name"], release: res["original_release_date"], image: res["image"]["medium_url"], description: res["deck"])
end
