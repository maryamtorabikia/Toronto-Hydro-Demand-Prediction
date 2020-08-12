import os
from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
# Add your Postgres password into the config.py file
from config import password

app = Flask(__name__)


# Setup Postgres connection
engine = create_engine(f'postgresql://postgres:{password}@dbname.cxw2xnixkpbl.ca-central-1.rds.amazonaws.com/postgres')


# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
hydro = Base.classes.hydro
weather = Base.classes.weather
weather_hydro_2020 = Base.classes.weather_hydro_2020
final = Base.classes.final
finalmean = Base.classes.finalmean

# Create the main page
@app.route("/")
def welcome():
    return render_template("index.html")

# Create the Hydro Jsonify Page
@app.route("/api/v1.0/hydro")
def hydrofunc():
    session = Session(engine)
    results = session.query(hydro.date,hydro.hour,hydro.demanded_toronto,hydro.weekday,hydro.previous_hour_demand,hydro.previous_day_demand).all()

    session.close()
    
    
    all_hydro = []
    for date, hour, demanded_toronto, weekday, previous_hour_demand, previous_day_demand in results:
        hydro_dict = {}
        hydro_dict["date"] = date
        hydro_dict["hour"] = hour
        hydro_dict["demanded_toronto"] = demanded_toronto
        hydro_dict["weekday"] = weekday
        hydro_dict["previous_hour_demand"] = previous_hour_demand
        hydro_dict["previous_day_demand"] = previous_day_demand
        all_hydro.append(hydro_dict)

    return jsonify(all_hydro)

# Create the Weather Jsonify Page
@app.route("/api/v1.0/weather")
def weatherfunc():
    session = Session(engine)
    results = session.query(weather.date,weather.hour,weather.dt,weather.timezone,weather.temp,weather.feels_like,weather.temp_min,weather.temp_max,weather.pressure,weather.humidity,weather.wind_speed,weather.wind_deg,weather.clouds_all,weather.weather_main,weather.weather_description,weather.temp_hourly_change,weather.month,weather.temp_daily_change).all()

    session.close()
       
    all_weather = []
    for date,hour,dt,timezone,temp,feels_like,temp_min,temp_max,pressure,humidity,wind_speed,wind_deg,clouds_all,weather_main,weather_description, temp_hourly_change, month, temp_daily_change in results:
        weather_dict = {}
        weather_dict["date"] = date
        weather_dict["hour"] = hour
        weather_dict["dt"] = dt
        weather_dict["timezone"] = timezone
        weather_dict["temp"] = temp
        weather_dict["feels_like"] = feels_like
        weather_dict["temp_min"] = temp_min
        weather_dict["temp_max"] = temp_max
        weather_dict["pressure"] = pressure
        weather_dict["humidity"] = humidity
        weather_dict["wind_speed"] = wind_speed
        weather_dict["wind_deg"] = wind_deg
        weather_dict["clouds_all"] = clouds_all
        weather_dict["weather_main"] = weather_main
        weather_dict["weather_description"] = weather_description
        weather_dict["temp_hourly_change"] = temp_hourly_change
        weather_dict["month"] = month
        weather_dict["temp_daily_change"] = temp_daily_change
        all_weather.append(weather_dict)
    
    return jsonify(all_weather)

@app.route("/api/v1.0/weather_hydro_2020")
def weather_hydrofunc():
    session = Session(engine)
    results = session.query(weather_hydro_2020.date,weather_hydro_2020.hour,weather_hydro_2020.dt,weather_hydro_2020.humidity,weather_hydro_2020.pressure,weather_hydro_2020.temperature,weather_hydro_2020.temp_daily_change,weather_hydro_2020.temp_hourly_change,weather_hydro_2020.month,weather_hydro_2020.wind_speed,weather_hydro_2020.weekday,weather_hydro_2020.previous_hour_demand,weather_hydro_2020.previous_day_demand,weather_hydro_2020.demand).all()

    session.close()
       
    all_weather_hydro_2020 = []
    for date,hour,dt,humidity,pressure,temperature,temp_daily_change,temp_hourly_change,month,wind_speed,weekday,previous_hour_demand,previous_day_demand,demand in results:
        weather_hydro_2020_dict = {}
        weather_hydro_2020_dict["date"] = date
        weather_hydro_2020_dict["hour"] = hour
        weather_hydro_2020_dict["dt"] = dt
        weather_hydro_2020_dict["humidity"] = humidity
        weather_hydro_2020_dict["pressure"] = pressure
        weather_hydro_2020_dict["temperature"] = temperature
        weather_hydro_2020_dict["temp_daily_change"] = temp_daily_change
        weather_hydro_2020_dict["temp_hourly_change"] = temp_hourly_change
        weather_hydro_2020_dict["month"] = month
        weather_hydro_2020_dict["wind_speed"] = wind_speed
        weather_hydro_2020_dict["weekday"] = weekday
        weather_hydro_2020_dict["previous_hour_demand"] = previous_hour_demand
        weather_hydro_2020_dict["previous_day_demand"] = previous_day_demand
        weather_hydro_2020_dict["demand"] = demand      
        all_weather_hydro_2020.append(weather_hydro_2020_dict)
    
    return jsonify(all_weather_hydro_2020)


@app.route("/api/v1.0/final")
def finalfunc():
    session = Session(engine)
    results = session.query(final.date,final.hour,final.dt,final.humidity,final.pressure,final.temperature,final.temp_daily_change,final.temp_hourly_change,final.month,final.wind_speed,final.weekday,final.previous_hour_demand,final.previous_day_demand,final.predicted_demand, final.actual_demand).all()

    session.close()
       
    all_final = []
    for date,hour,dt,humidity,pressure,temperature,temp_daily_change,temp_hourly_change,month,wind_speed,weekday,previous_hour_demand,previous_day_demand,predicted_demand, actual_demand in results:
        final_dict = {}
        final_dict["date"] = date
        final_dict["hour"] = hour
        final_dict["dt"] = dt
        final_dict["humidity"] = humidity
        final_dict["pressure"] = pressure
        final_dict["temperature"] = temperature
        final_dict["temp_daily_change"] = temp_daily_change
        final_dict["temp_hourly_change"] = temp_hourly_change
        final_dict["month"] = month
        final_dict["wind_speed"] = wind_speed
        final_dict["weekday"] = weekday
        final_dict["previous_hour_demand"] = previous_hour_demand
        final_dict["previous_day_demand"] = previous_day_demand
        final_dict["predicted_demand"] = predicted_demand
        final_dict["actual_demand"] = actual_demand      
        all_final.append(final_dict)
    
    return jsonify(all_final)

@app.route("/api/v1.0/finalmean")
def finalmeanfunc():
    session = Session(engine)
    results = session.query(finalmean.date,finalmean.dt,finalmean.month,finalmean.predicted_demand, finalmean.actual_demand).all()

    session.close()
       
    all_finalmean = []
    for date,dt,month,predicted_demand, actual_demand in results:
        finalmean_dict = {}
        finalmean_dict["date"] = date
        finalmean_dict["dt"] = dt
        finalmean_dict["month"] = month
        finalmean_dict["predicted_demand"] = predicted_demand
        finalmean_dict["actual_demand"] = actual_demand      
        all_finalmean.append(finalmean_dict)
    
    return jsonify(all_finalmean)

if __name__ == "__main__":
    app.run(debug=True)