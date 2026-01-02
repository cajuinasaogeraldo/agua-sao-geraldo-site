#!/bin/bash

SOURCE_DIR=""
DEST_DIR=""

# Tenta extrair dos argumentos se disponível, senão usa variáveis de ambiente
if [[ -n "$RSYNC_SOURCE" ]] && [[ -n "$RSYNC_DEST" ]]; then
  SOURCE_DIR="$RSYNC_SOURCE"
  DEST_DIR="$RSYNC_DEST"
fi

# Função auxiliar para checar se diff é só de cores
check_color_diff() {
  local src="$1"
  local dst="$2"
  local file="$3"
  
  [[ ! -f "$dst/$file" ]] && return 1
  
  # Remove linhas com diferenças de cores
  local real_diff=$(diff "$src/$file" "$dst/$file" 2>/dev/null | \
    grep -E '^[<>]' | \
    grep -vE '(agua|caju)\.(primary|secondary|heading|header|error|success|warning|info)|#[0-9a-fA-F]{6}|(blue|green|yellow|orange|light|dark)')
  
  # Se não sobrou nada, é só cor
  [[ -z "$real_diff" ]] && return 0 || return 1
}

export -f check_color_diff
export SOURCE_DIR DEST_DIR

awk -v src_dir="$SOURCE_DIR" -v dst_dir="$DEST_DIR" '
BEGIN {
  del=add=content=time=size=perm=owner=dir=other=ignored=0
  smart_filter = (src_dir != "" && dst_dir != "")
}

/^\*deleting/ {
  del++; d[del]=$2
  next
}

/^>f\+/ {
  add++; a[add]=$2
  next
}

/^cd\+/ {
  dir++; r[dir]=$2
  next
}

/^>fc/ || /^>f\.st/ {
  file = $2
  
  if (smart_filter) {
    cmd = "check_color_diff \"" src_dir "\" \"" dst_dir "\" \"" file "\""
    if ((cmd | getline result) >= 0) {
      close(cmd)
      if (result == 0 || ERRNO == "") {
        ignored++; ig[ignored]=file
        next
      }
    }
  }
  
  content++; c[content]=file
  next
}

/^>f\.s[^t]/ {
  size++; s[size]=$2
  next
}

/^>f\.[^s].*T/ {
  time++; t[time]=$2
  next
}

/^>f.*p/ {
  perm++; p[perm]=$2
  next
}

/^>f.*[og]/ {
  owner++; o[owner]=$2
  next
}

/^>f/ {
  other++; u[other]=$2 " [" $0 "]"
  next
}

END {
  if (del) {
    print "🗑  DELETE (" del ")"
    for (i=1; i<=del; i++) print "   - " d[i]
    print ""
  }
  if (add) {
    print "➕ ADD (" add ")"
    for (i=1; i<=add; i++) print "   + " a[i]
    print ""
  }
  if (dir) {
    print "📁 NEW DIR (" dir ")"
    for (i=1; i<=dir; i++) print "   • " r[i]
    print ""
  }
  if (content) {
    print "📝 CONTENT CHANGED (" content ")"
    for (i=1; i<=content; i++) print "   ≠ " c[i]
    print ""
  }
  #if (ignored) {
  #  print "🎨 IGNORED (color-only) (" ignored ")"
  #  for (i=1; i<=ignored; i++) print "   ~ " ig[i]
  #  print ""
  #}
  if (size) {
    print "📏 SIZE CHANGED (" size ")"
    for (i=1; i<=size; i++) print "   ⚖ " s[i]
    print ""
  }
  #if (time) {
  #  print "🕐 TIMESTAMP ONLY (" time ")"
  #  for (i=1; i<=time; i++) print "   ⏱ " t[i]
  #  print ""
  #}
  #if (perm) {
  #  print "🔒 PERMISSIONS (" perm ")"
  #  for (i=1; i<=perm; i++) print "   🔑 " p[i]
  #  print ""
  #}
  #if (owner) {
  #  print "👤 OWNER/GROUP (" owner ")"
  #  for (i=1; i<=owner; i++) print "   👥 " o[i]
  #  print ""
  #}
  if (other) {
    print "❓ OTHER (" other ")"
    for (i=1; i<=other; i++) print "   ? " u[i]
    print ""
    print "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print "📖 Format: YXcstpoguax"
    print "   c=checksum s=size t=time p=perms"
    print "   o=owner g=group +=new"
  }
}
'