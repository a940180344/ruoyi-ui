import request from '@/utils/request'

// 查询wenjian列表
export function listWenjian(query) {
  return request({
    url: '/wenjian/wenjian/list',
    method: 'get',
    params: query
  })
}

// 查询wenjian详细
export function getWenjian(id) {
  return request({
    url: '/wenjian/wenjian/' + id,
    method: 'get'
  })
}

// 新增wenjian
export function addWenjian(data) {
  return request({
    url: '/wenjian/wenjian',
    method: 'post',
    data: data
  })
}

// 修改wenjian
export function updateWenjian(data) {
  return request({
    url: '/wenjian/wenjian',
    method: 'put',
    data: data
  })
}

// 删除wenjian
export function delWenjian(id) {
  return request({
    url: '/wenjian/wenjian/' + id,
    method: 'delete'
  })
}
