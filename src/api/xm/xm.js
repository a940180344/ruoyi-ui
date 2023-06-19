import request from '@/utils/request'

// 查询xm列表
export function listXm(query) {
  return request({
    url: '/xm/xm/list',
    method: 'get',
    params: query
  })
}

// 查询xm详细
export function getXm(id) {
  return request({
    url: '/xm/xm/' + id,
    method: 'get'
  })
}

// 新增xm
export function addXm(data) {
  return request({
    url: '/xm/xm',
    method: 'post',
    data: data
  })
}

// 修改xm
export function updateXm(data) {
  return request({
    url: '/xm/xm',
    method: 'put',
    data: data
  })
}

// 删除xm
export function delXm(id) {
  return request({
    url: '/xm/xm/' + id,
    method: 'delete'
  })
}
