@aware(['component', 'tableName'])
@props(['row', 'rowIndex'])

@php
    $customAttributes = $component->getTrAttributes($row, $rowIndex);
@endphp

<tr
    rowpk='{{ $row->{$component->getPrimaryKey()} }}'
    x-on:dragstart.self="currentlyReorderingStatus && dragStart(event)"
    x-on:drop.prevent="currentlyReorderingStatus && dropEvent(event)"
    x-on:dragover.prevent.throttle.500ms="currentlyReorderingStatus && dragOverEvent(event)"
    x-on:dragleave.prevent.throttle.500ms="currentlyReorderingStatus && dragLeaveEvent(event)"
    @if($component->hasDisplayLoadingPlaceholder()) 
    wire:loading.remove
    @else
    wire:loading.class.delay="opacity-50 dark:bg-gray-900 dark:opacity-60"
    @endif
    id="{{ $tableName }}-row-{{ $row->{$component->getPrimaryKey()} }}"
    :draggable="currentlyReorderingStatus"
    wire:key="{{ $tableName }}-tablerow-tr-{{ $row->{$component->getPrimaryKey()} }}"
    loopType="{{ ($rowIndex % 2 === 0) ? 'even' : 'odd' }}"
    {{
        $attributes->merge($customAttributes)
                ->class(['bg-[#313131] dark:bg-[#313131] border-b border-[#262626] dark:text-white ' => ($component->isTailwind() && ($customAttributes['default'] ?? true) && $rowIndex % 2 === 0)])
                ->class(['bg-[#313131] dark:bg-[#313131] border-b border-[#262626] dark:text-white' => ($component->isTailwind() && ($customAttributes['default'] ?? true) && $rowIndex % 2 !== 0)])
                ->class(['cursor-pointer border-b border-[#262626]' => ($component->isTailwind() && $component->hasTableRowUrl() && ($customAttributes['default'] ?? true))])
                ->class(['bg-light rappasoft-striped-row border-b border-[#262626]' => ($component->isBootstrap() && $rowIndex % 2 === 0 && ($customAttributes['default'] ?? true))])
                ->class(['bg-white rappasoft-striped-row border-b border-[#262626]' => ($component->isBootstrap() && $rowIndex % 2 !== 0 && ($customAttributes['default'] ?? true))])
                ->except(['default'])
    }}

>
    {{ $slot }}
</tr>
