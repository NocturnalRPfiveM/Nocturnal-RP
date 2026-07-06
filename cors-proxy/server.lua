local function addCorsHeaders(res)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
end

SetHttpHandler(function(req, res)
  addCorsHeaders(res)

  if req.method == 'OPTIONS' then
    res.status = 204
    res.send('')
    return
  end

  if req.path == '/cors/dynamic.json' then
    local players = GetPlayers()
    local numClients = #players
    local maxClients = GetConvar('sv_maxClients', '48')

    res.status = 200
    res.send(json.encode({
      clients = numClients,
      sv_maxclients = maxClients
    }))

  elseif req.path == '/cors/players.json' then
    local players = GetPlayers()
    local playerList = {}

    for i = 1, #players do
      local playerId = players[i]
      table.insert(playerList, {
        id = tonumber(playerId),
        name = GetPlayerName(playerId)
      })
    end

    res.status = 200
    res.send(json.encode(playerList))

  else
    res.status = 200
    res.send(json.encode({
      status = 'online',
      cors_endpoints = {
        '/cors/dynamic.json',
        '/cors/players.json'
      }
    }))
  end
end)
