

function ok(res, mes, obj) {
    obj.success = true;
    obj.message = mes;
    return res.status(200).json(obj);
}

function logicError(res, mes) {
    return res.status(200).json({
        success: false,
        message: mes
    });
}

function error(res, statusCode, mes) {
    return res.status(statusCode).json({
        success: false,
        message: mes
    });
}

export { ok, logicError, error };