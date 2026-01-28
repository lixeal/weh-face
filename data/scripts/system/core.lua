local HttpService = game:GetService("HttpService")
local infoPath = "auraware/wf/info.json"

local wf = {}

-- Внутренняя функция для отправки запросов
local function send(payload)
    local success, response = pcall(function()
        return HttpService:PostAsync(
            "https://weh-face.vercel.app/api/main", 
            HttpService:JSONEncode(payload)
        )
    end)
    
    if success then
        if response:find("AUTH_SUCCESS") then
            if not isfolder("auraware/wf") then makefolder("auraware/wf") end
            local jsonData = response:split("|")[2]
            writefile(infoPath, jsonData)
            return "Аккаунт успешно привязан!"
        end
        return response
    else
        return "Ошибка: " .. tostring(response)
    end
end

-- Вспомогательная функция для получения текущих данных
local function getCreds()
    if isfile(infoPath) then
        return HttpService:JSONDecode(readfile(infoPath))
    end
    return {}
end

-- [1] Регистрация
function wf.register(user, pass)
    local cmd = string.format("create account\nusername = %s\npassword = %s", user, pass)
    print("[WF]: Регистрируем...")
    print(send({command = cmd}))
end

-- [2] Загрузка файла
function wf.add(path, content)
    local creds = getCreds()
    local cmd = string.format("add file %s =\n%s", path, content)
    print("[WF]: Загрузка файла " .. path .. "...")
    print(send({
        command = cmd,
        user = creds.username,
        pass = creds.password
    }))
end

-- [3] Быстрая авторизация (если уже есть акк, но нет файла info)
function wf.login(user, pass)
    -- Просто перезаписываем инфо через команду создания (бекэнд поймет)
    wf.register(user, pass)
end

_G.wf = wf
print("[WF]: Удобный ввод загружен! Используйте:")
print("_G.wf.register('nick', 'pass')")
print("_G.wf.add('folder/file.lua', 'print(1)')")
