import request from '@/utils/request'

// 查询jifen列表
export function listJifen(query) {
  return request({
    url: '/jifen/jifen/list',
    method: 'get',
    params: query
  })
}

// 查询jifen详细
export function getJifen(id) {
  return request({
    url: '/jifen/jifen/' + id,
    method: 'get'
  })
}

// 新增jifen
export function addJifen(data) {
  return request({
    url: '/jifen/jifen',
    method: 'post',
    data: data
  })
}

// 修改jifen
export function updateJifen(data) {
  return request({
    url: '/jifen/jifen',
    method: 'put',
    data: data
  })
}

// 删除jifen
export function delJifen(id) {
  return request({
    url: '/jifen/jifen/' + id,
    method: 'delete'
  })
}
