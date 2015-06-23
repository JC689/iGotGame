class GamesController < ApplicationController
  def index
    render :json => Game.all
  end

  def search
    key = JSON.load File.new('secrets.json')
    req_url = "http://www.giantbomb.com/api/search?format=json&query=#{params[:search]}&resources=game&field_list=name,image,original_release_date,&api_key=#{key['key']}"
    response = HTTParty.get(req_url)["results"]
    render :json => response
  end

  def show
    @game = Game.find(params[:id])
  end

  def create
    my_game = JSON.parse(params.keys[0])
    new_game = {name: my_game["name"], release: my_game["original_release_date"], image: my_game["image"], description: my_game["description"]}
    @game = Game.create(new_game)
  end

  def destroy
    puts 'DELETEING SOMETHING'
    puts params
    @game = Game.find(params[:id])
    @game.destroy
  end

end
