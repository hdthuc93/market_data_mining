import Area from '../models/area-model';

function updateCoordinate(data) {
    return Area.update({
        xAxis: data.x_axis,
        yAxis: data.y_axis
    }, {
        where: {
            ID: data.id
        }
    });
}

export default { updateCoordinate }