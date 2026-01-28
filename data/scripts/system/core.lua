local function wf_request(url, data)
    local HttpService = game:GetService("HttpService")
    local request_func = (syn and syn.request) or (http and http.request) or http_request or request
    
    -- Если request() не найден, выводим четкую ошибку
    if not request_func then 
        return {Success = false, Body = "Твой эксплоит не поддерживает функцию request()"} 
    end

    local response = request_func({
        Url = url,
        Method = "POST",
        Headers = { ["Content-Type"] = "application/json" },
        Body = HttpService:JSONEncode(data)
    })
    return {Success = (response.StatusCode == 200), Body = response.Body}
end

-- В функции регистрации:
function wf.register(user, pass)
    local res = wf_request("https://weh-face.vercel.app/register", {
        user = tostring(user),
        pass = tostring(pass)
    })
    print("[WF Result]: " .. res.Body)
end
