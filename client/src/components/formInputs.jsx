import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import MapBox from './mapContainer';
import { useLocation } from 'react-router-dom';
var timer;
//const functionURL = "https://flavescent-magpie-3929.twil.io/send-email"
const intialState = {
    from: '',
    to: '',
    date: '',
    time: ''
}
function FormInput() {
    const location = useLocation();
    const [formInput, setFormInput] = useState(intialState);
    const [currcityWeather, setcurrcityWeather] = useState(JSON.parse(localStorage.getItem('fromCity')));
    const [tocityWeather, settocityWeather] = useState(JSON.parse(localStorage.getItem('toCity')));
    const [isFormfilled, setFormfilled] = useState(false);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
    const [availableTime, setAvailableTime] = useState('');
    const [cweatherData, setcWeatherData] = useState(JSON.parse(localStorage.getItem('cweatherData')));
    const [tweatherData, settWeatherData] = useState(JSON.parse(localStorage.getItem('tweatherData')));
    const [emailData, setemailData] = useState(JSON.parse(localStorage.getItem({ from: '', subject: '', body: '' })));

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formInput);
        setUserData(formInput);
        localStorage.setItem('userData', JSON.stringify(formInput));

        console.log("From and To city are same");
        const currCity = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
            params: { q: `${formInput.from}`, days: '3' },
            headers: {
                'X-RapidAPI-Key': 'c2c16bd498mshbe8d539aec12942p166ddcjsn5b0358c7847f',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        axios.request(currCity).then(function (response) {
            localStorage.setItem("fromCity", JSON.stringify(response.data));
            setcurrcityWeather(response.data);
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
        const toCity = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
            params: { q: `${formInput.to}`, days: '3' },
            headers: {
                'X-RapidAPI-Key': 'c2c16bd498mshbe8d539aec12942p166ddcjsn5b0358c7847f',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        axios.request(toCity).then(function (response) {
            localStorage.setItem("toCity", JSON.stringify(response.data));
            settocityWeather(response.data);
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
        setFormInput(intialState);
    }
    function WeatherDetails() {
        const userTime = userData.time;
        const available = currcityWeather.forecast.forecastday;
        var d = new Date();
        let time = d.toLocaleString('en-US', {
            hour12: false,
        });
        console.log(time.substring(10, 15));
        console.log(available);
        for (let j = 0; j < 24; j++) {
            if (userTime <= available[0].hour[j].time.substring(11, 16) || time.substring(10, 15) <= available[0].hour[j].time.substring(11, 16)) {
                console.log(userTime);
                console.log(available[0].hour[j].time.substring(11, 16));
                if (available[0].hour[j].condition.text.indexOf('Sunny') >= 0 || available[0].hour[j].condition.text.indexOf('Clear') >= 0) {
                    console.log("Your are good to go");
                    setAvailableTime(available[0].hour[j].time);
                    break;
                } else {
                    console.log("You are not good to go");
                    continue;
                }
            } else {
                console.log("Enter Valid Date");
                continue;
            }
        }


        console.log(availableTime);
    }
    function Journey() {
        var d = new Date();
        let time = d.toLocaleString('en-US', {
            hour12: false,
        });
        console.log(time.substring(10, 15));
        const currCity = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
            params: { q: `${userData.from}`, days: '1' },
            headers: {
                'X-RapidAPI-Key': 'c2c16bd498mshbe8d539aec12942p166ddcjsn5b0358c7847f',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        axios.request(currCity).then(function (response) {
            console.log(response.data);
            setcWeatherData(response.data);
            localStorage.setItem("cweatherData", JSON.stringify(response.data));
        }).catch(function (error) {
            console.error(error);
        });
        const toCity = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
            params: { q: `${userData.to}`, days: '1' },
            headers: {
                'X-RapidAPI-Key': 'c2c16bd498mshbe8d539aec12942p166ddcjsn5b0358c7847f',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        axios.request(toCity).then(function (response) {
            console.log(response.data);
            settWeatherData(response.data);
            localStorage.setItem("tweatherData", JSON.stringify(response.data));
        }).catch(function (error) {
            console.error(error);
        });
        sendEmail();
    }
    async function sendEmail() {
        // console.log(cweatherData.current.condition.text)
        const fromEmail = "harshsingh16d@gmail.com"
        const subject = "Weather data for your journey"
        const body = `Weather seems to be ${cweatherData.current.condition.text}`
        const response = await fetch('https://flavescent-magpie-3929.twil.io/mail', {
            method: "post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: new URLSearchParams({ fromEmail, subject, body }).toString(),
        })
        if (response.status === 200) {
            console.log("Email sent successfully");
        } else {
            const json = await response.json()
            console.log(json)
        }
    }
    function finishJourney() {
        clearInterval(timer);
    }
    function startJourney() {
        timer = setInterval(Journey, 60000)
    }
    useEffect(() => {
        //console.log(user);
        if (currcityWeather != null) {

            setFormfilled(true)
        }
        else {
            console.log("Form is not filled");
            setFormfilled(false)

        }

    }, [location]);

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>FROM</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter Your city"
                            onChange={(e) => setFormInput({ ...formInput, from: e.target.value })}
                            value={formInput.from}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>TO</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter destination city"
                            onChange={(e) => setFormInput({ ...formInput, to: e.target.value })}
                            value={formInput.to}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>DATE</Form.Label>
                        <Form.Control
                            required
                            type="date"
                            placeholder="Enter Date"
                            onChange={(e) => setFormInput({ ...formInput, date: e.target.value })}
                            value={formInput.date}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>TIME</Form.Label>
                        <Form.Control
                            required
                            type="time"
                            placeholder="Enter Time"
                            onChange={(e) => setFormInput({ ...formInput, time: e.target.value })}
                            value={formInput.time}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                </Row>

                <Button type="submit">Search Details</Button>
                <Button onClick={WeatherDetails} >Show Available Time </Button>
            </Form>

            <br />

            {isFormfilled ? (
                <><h2>Weather Forecast Details for {userData.date} {userData.time} <Button onClick={startJourney} >Track Your Journey </Button><Button onClick={finishJourney} >Journey Finished </Button></h2>
                    <Alert variant='info' >
                        Your location {currcityWeather.location.name}'s weather is {currcityWeather.forecast.forecastday[0].day.condition.text} today  <br />
                        Your destination {tocityWeather.location.name}'s weather is {tocityWeather.forecast.forecastday[0].day.condition.text} today <br />
                        Your are good to go at {availableTime}
                    </Alert>
                    <MapBox />
                </>

            ) : (<>Fill the Form</>)}

        </>
    );
}

export default FormInput;