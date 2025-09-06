const moment = require('moment-timezone');

class DataProcessor {
    constructor() {}

    calculateTime(timestamp) {
        if (!timestamp) return "None";

        const date = moment.tz(timestamp, "Europe/Rome");
        const now = moment.tz("Europe/Rome");
        const diff = moment.duration(now.diff(date));

        if (diff.asSeconds() <= 0)
            return "None";

        if (diff.asSeconds() < 60) {
            return [Math.floor(diff.asSeconds()), "sec"];
        } else if (diff.asMinutes() < 60) {
            return [Math.floor(diff.asMinutes()), "min"];
        } else if (diff.asHours() < 24) {
            return [Math.floor(diff.asHours()), "h"];
        } else {
            return [Math.floor(diff.asDays()), "d"];
        }
    }

    processHistoricalData(historical) {
        if (!historical || historical.length === 0) {
            return null;
        }

        let lastData = historical[historical.length - 1];

        if (lastData) {
            lastData.last_irrigation = this.calculateTime(lastData.irrigation_time);
            lastData.timeOfmisurationDiff = this.calculateTime(lastData.timeOfmisuration);
        }
    }
}

module.exports = DataProcessor;