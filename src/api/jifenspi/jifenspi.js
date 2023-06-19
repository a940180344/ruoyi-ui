import request from '@/utils/request'

// 查询jifenspi列表
export function listJifenspi(query) {
  return request({
    url: '/jifenspi/jifenspi/list',
    method: 'get',
    params: query
  })
}

// 查询jifenspi详细
export function getJifenspi(id) {
  return request({
    url: '/jifenspi/jifenspi/' + id,
    method: 'get'
  })
}

// 新增jifenspi
export function addJifenspi(data) {
  return request({
    url: '/jifenspi/jifenspi',
    method: 'post',
    data: data
  })
}

// 修改jifenspi
export function updateJifenspi(data) {
  return request({
    url: '/jifenspi/jifenspi',
    method: 'put',
    data: data
  })
}

// 删除jifenspi
export function delJifenspi(id) {
  return request({
    url: '/jifenspi/jifenspi/' + id,
    method: 'delete'
  })
}
